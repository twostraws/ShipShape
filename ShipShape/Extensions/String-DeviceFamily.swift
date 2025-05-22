//
// String-DeviceFamily.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    var convertFromDeviceFamily: String {
        switch self {
        case "IPHONE": "iPhone"
        case "IPAD": "iPad"
        case "MAC": "Mac"
        default: self
        }
    }
}
