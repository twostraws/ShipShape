//
// String-NominationState.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    var convertFromNominationState: String {
        switch self {
        case "DRAFT": "Draft"
        case "SUBMITTED": "Submitted"
        case "ARCHIVED": "Archived"
        default: self
        }
    }
}
