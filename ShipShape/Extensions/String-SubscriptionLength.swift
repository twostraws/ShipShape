//
// String-SubscriptionLength.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    var convertFromSubscriptionLength: String {
        switch self {
        case "ONE_YEAR": "One year"
        default: self
        }
    }
}
