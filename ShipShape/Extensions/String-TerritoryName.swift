//
// String-TerritoryName.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's three-letter country codes for actual names, with a
    /// special case for Kosovo because it appears to be unhandled.
    var convertFromTerritory: String {
        if self == "XKS" {
            "Kosovo"
        } else {
            Locale.current.localizedString(forRegionCode: self) ?? self
        }
    }
}
