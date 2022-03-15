package com.codingdojo.springjwt.util;

import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.AnnotationIntrospector.ReferenceProperty.Type;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.MediaType;

@Component
public class MultipartJackson2HttpMessageConverter extends AbstractJackson2HttpMessageConverter {

/**
 * Converter for support http request with header Content-Type: multipart/form-data
 */
public MultipartJackson2HttpMessageConverter(ObjectMapper objectMapper) {
    super(objectMapper, MediaType.APPLICATION_OCTET_STREAM);
}

@Override
public boolean canWrite(Class<?> clazz, MediaType mediaType) {
    return false;
}

@Override
	public boolean canWrite(java.lang.reflect.Type type, Class<?> clazz, MediaType mediaType) {
		// TODO Auto-generated method stub
	return false;
	}

@Override
protected boolean canWrite(MediaType mediaType) {
    return false;
}
}
