package ca.bc.gov.bcws.nrs.downloadapi.handlers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import ca.bc.gov.bcws.nrs.downloadapi.exceptions.DownloadLimitExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DownloadLimitExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleDownloadLimitExceeded(
            DownloadLimitExceededException ex) {

        return Map.of(
                "message",
                ex.getMessage());
    }
}