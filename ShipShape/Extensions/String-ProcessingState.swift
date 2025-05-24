//
// String-ProcessingState.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's App Store state hard-coded strings, e.g. `PROCESSING` becomes "Processing".
    var convertFromProcessingState: String {
        switch self {
        case "PROCESSING": "Processing ⏳"
        case "FAILED": "Failed 🔴"
        case "INVALID": "Invalid ⚠️"
        case "VALID": "Valid ✅"
        default: self
        }
    }
}
