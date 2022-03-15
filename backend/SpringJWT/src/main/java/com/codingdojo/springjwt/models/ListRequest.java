package com.codingdojo.springjwt.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class ListRequest{
    private List<List<String>> inputList;
    //generate getter, setter for it
}