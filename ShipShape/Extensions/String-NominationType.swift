//
// String-NominationType.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    var convertFromNominationType: String {
        switch self {
        case "APP_LAUNCH": "Launch"
        case "APP_ENHANCEMENTS": "Enhancements"
        case "NEW_CONTENT": "New Content"
        default: self
        }
    }
}
