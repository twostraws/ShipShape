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
        case "APP_APPLE_VISION_PRO": "Vision Pro"
        case "APP_IPAD_PRO_3GEN_129": "iPad Pro (12.9-inch)"
        case "APP_IPHONE_67": "iPhone (6.7-inch)"
        case "APP_DESKTOP": "macOS"
        default: self
        }
    }
}
