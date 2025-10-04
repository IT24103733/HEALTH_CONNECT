package com.example.app.util;

public final class SqlEscapeUtil {
    private SqlEscapeUtil() {}

    public static String escapeSql(String s) {
        if (s == null) {
            return null;
        }
        return s.replace("'", "''")
                .replace("\\", "\\\\")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
