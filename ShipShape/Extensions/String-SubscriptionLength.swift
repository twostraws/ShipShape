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
        case "THREE_DAYS": "Three days"
        case "ONE_WEEK": "One week"
        case "TWO_WEEKS": "Two weeks"
        case "ONE_MONTH": "One month"
        case "TWO_MONTHS": "Two months"
        case "THREE_MONTHS": "Three months"
        case "SIX_MONTHS": "Six months"
        case "ONE_YEAR": "One year"
        default: self
        }
    }
}
