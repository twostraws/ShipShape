//
// Array-ContentStatuses.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension Array where Element == String {
    var convertFromContentStatus: String {
        self.map { string in
            switch string {
            case "AVAILABLE": "Available 🟢"
            case "CANNOT_SELL": "Cannot Sell 🔴"
            case "MISSING_GRN": "Missing Game Registration Number ⚠️"
            case "PROCESSING_TO_AVAILABLE": "Processing to Available"
            default: string
            }
        }.joined(separator: "\n")
    }
}
