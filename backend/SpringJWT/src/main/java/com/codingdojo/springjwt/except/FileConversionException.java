package com.codingdojo.springjwt.except;

public class FileConversionException extends RuntimeException {
	
	public FileConversionException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
	
	
}
