// This code is auto-generated by Segment Typewriter. Do not edit.
package com.segment.analytics;

import java.util.ArrayList;
import java.util.List;

abstract class PropertiesSerializable {
    abstract Properties toProperties();

    static List<Properties> toPropertyList(List<? extends PropertiesSerializable> list) {
        List<Properties> properties = new ArrayList<>(list.size());
        for (PropertiesSerializable item : list) {
            properties.add(item.toProperties());
        }
        return properties;
    }
}
