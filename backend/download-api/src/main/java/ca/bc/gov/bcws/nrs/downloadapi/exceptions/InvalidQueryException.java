package ca.bc.gov.bcws.nrs.downloadapi.exceptions;

public class InvalidQueryException extends RuntimeException {

    public InvalidQueryException(String message) {
        super(message);
    }
}