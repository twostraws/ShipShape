//
// String-Platform.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces device hard-coded strings, e.g.
    /// `MAC_OS` becomes "macOS".
    var convertFromPlatform: String {
        switch self {
        case "IOS": "iOS"
        case "MAC_OS": "macOS"
        case "VISION_OS": "visionOS"
        case "TV_OS": "tvOS"
        default: self
        }
    }
}
