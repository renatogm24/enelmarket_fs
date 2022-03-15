package com.codingdojo.springjwt.except;

import java.util.List;

import lombok.Getter;

@Getter
public class InvalidImageExtensionException extends RuntimeException {

    List<String> validExtensions;

    public InvalidImageExtensionException(List<String> validExtensions) {
        this.validExtensions = validExtensions;
    }
}
