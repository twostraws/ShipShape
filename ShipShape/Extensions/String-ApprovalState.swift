//
// String-ApprovalState.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's App Store state hard-coded strings, e.g.
    /// `APPROVED` becomes "Approved".
    var convertFromApprovalState: String {
        switch self {
        case "APPROVED": "Approved 🟢"
        default: self
        }
    }
}
