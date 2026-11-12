package ca.bc.gov.bcws.nrs.downloadapi.exceptions;

public class InvalidQueueMessageException
        extends RuntimeException {

    private final String messageId;
    private final String popReceipt;

    public InvalidQueueMessageException(
            String messageId,
            String popReceipt,
            Throwable cause) {

        super("Failed to deserialize queue message", cause);

        this.messageId = messageId;
        this.popReceipt = popReceipt;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getPopReceipt() {
        return popReceipt;
    }
}