//
// ASCIdentifiedType.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// The App Store Connect API loves to have little types with identifiers, many of which are
/// links to some other data.
struct ASCIdentifiedType: Codable, Hashable {
    var id: String
    var type: String
}

/// For some extra fun, `ASCIdentifiedType` is often wrapped with the key "data".
struct ASCIdentifiedTypeData: Codable, Hashable {
    var data: ASCIdentifiedType?
}
