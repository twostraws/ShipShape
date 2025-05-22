//
// String-DeviceName.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces device hard-coded strings, e.g.
    /// `APP_DESKTOP` becomes "macOS".
    var convertFromDeviceName: String {
        switch self {
        case "APP_IPHONE_67", "IMESSAGE_APP_IPHONE_67": "iPhone (6.7-inch)"
        case "APP_IPHONE_61", "IMESSAGE_APP_IPHONE_61": "iPhone (6.1-inch)"
        case "APP_IPHONE_65", "IMESSAGE_APP_IPHONE_65": "iPhone (6.5-inch)"
        case "APP_IPHONE_58", "IMESSAGE_APP_IPHONE_58": "iPhone (5.8-inch)"
        case "APP_IPHONE_55", "IMESSAGE_APP_IPHONE_55": "iPhone (5.5-inch)"
        case "APP_IPHONE_47", "IMESSAGE_APP_IPHONE_47": "iPhone (4.7-inch)"
        case "APP_IPHONE_40", "IMESSAGE_APP_IPHONE_40": "iPhone (4.0-inch)"
        case "APP_IPHONE_35": "iPhone (3.5-inch)"
        case "APP_IPAD_PRO_3GEN_129", "IMESSAGE_APP_IPAD_PRO_3GEN_129": "iPad Pro (12.9-inch, 3rd Gen)"
        case "APP_IPAD_PRO_3GEN_11", "IMESSAGE_APP_IPAD_PRO_3GEN_11": "iPad Pro (11-inch, 3rd Gen)"
        case "APP_IPAD_PRO_129", "IMESSAGE_APP_IPAD_PRO_129": "iPad Pro (12.9-inch)"
        case "APP_IPAD_105", "IMESSAGE_APP_IPAD_105": "iPad (10.5-inch)"
        case "APP_IPAD_97", "IMESSAGE_APP_IPAD_97": "iPad (9.7-inch)"
        case "APP_DESKTOP": "macOS"
        case "APP_WATCH_ULTRA": "Apple Watch Ultra"
        case "APP_WATCH_SERIES_10": "Apple Watch Series 10"
        case "APP_WATCH_SERIES_7": "Apple Watch Series 7"
        case "APP_WATCH_SERIES_4": "Apple Watch Series 4"
        case "APP_WATCH_SERIES_3": "Apple Watch Series 3"
        case "APP_APPLE_TV": "Apple TV"
        case "APP_APPLE_VISION_PRO": "Vision Pro"
        default: self
        }
    }
}
