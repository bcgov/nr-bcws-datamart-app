package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.language.Argument;
import graphql.language.Selection;
import graphql.language.Document;
import graphql.language.Field;
import graphql.language.IntValue;
import graphql.language.OperationDefinition;
import graphql.language.StringValue;
import graphql.parser.Parser;
import graphql.language.AstPrinter;


import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;

@Service
public class DatamartQueryService {

    private static final Logger logger = LoggerFactory.getLogger(DatamartQueryService.class);

    @Value("${download.page-size:1000}")
    private int pageSize;


    public String applyPaging(String query, String cursor) {

        Document document;

        try {
            document = Parser.parse(query);
        } catch (Exception e) {

            logger.warn("Invalid GraphQL query provided", e);

            throw new InvalidQueryException(
                    "Invalid GraphQL query.");
        }

        OperationDefinition operation = (OperationDefinition) document.getDefinitions().get(0);

        Field field = (Field) operation.getSelectionSet().getSelections().get(0);

        List<Argument> arguments = new ArrayList<>(field.getArguments());

        arguments.removeIf(arg ->
                "first".equals(arg.getName())
                        || "after".equals(arg.getName()));

        arguments.add(
                Argument.newArgument()
                        .name("first")
                        .value(IntValue.newIntValue(BigInteger.valueOf(pageSize)).build())
                        .build());

        if (cursor != null)
            arguments.add(
                    Argument.newArgument()
                            .name("after")
                            .value(StringValue.newStringValue(cursor).build())
                            .build());

        List<Selection> selections = new ArrayList<>(field.getSelectionSet().getSelections());

        boolean hasNextPage = selections.stream()
                .filter(Field.class::isInstance)
                .map(Field.class::cast)
                .anyMatch(f -> "hasNextPage".equals(f.getName()));

        boolean hasEndCursor = selections.stream()
                .filter(Field.class::isInstance)
                .map(Field.class::cast)
                .anyMatch(f -> "endCursor".equals(f.getName()));

        if (!hasNextPage)
            selections.add(Field.newField("hasNextPage").build());

        if (!hasEndCursor)
            selections.add(Field.newField("endCursor").build());

        Field updatedField = field.transform(builder ->
                builder.arguments(arguments)
                        .selectionSet(
                                field.getSelectionSet()
                                        .transform(selectionBuilder ->
                                                selectionBuilder.selections(selections))));

        OperationDefinition updatedOperation = operation.transform(builder ->
                builder.selectionSet(
                        operation.getSelectionSet()
                                .transform(selectionBuilder ->
                                        selectionBuilder.selections(List.of(updatedField)))));

        Document updatedDocument = document.transform(builder ->
                builder.definitions(List.of(updatedOperation)));

        String updatedQuery = AstPrinter.printAst(updatedDocument);

        if (cursor == null) logger.info("Paged GraphQL query: {}", updatedQuery);

        return updatedQuery;
    }

    public String extractGraphQlError(String responseBody) {

        try {

            JsonNode response =
                    new ObjectMapper().readTree(responseBody);

            JsonNode errors = response.path("errors");

            if (errors.isArray() && !errors.isEmpty()) {

                return errors.get(0)
                        .path("message")
                        .asText("Invalid GraphQL query.");
            }

        } catch (Exception ignored) {
        }

        return "Invalid GraphQL query.";
    }

    
}
