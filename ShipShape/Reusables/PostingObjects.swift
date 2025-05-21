//
// PostingObjects.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCPostResponse<PostData: Encodable>: Encodable {
    var data: PostData
}

struct ASCPostAttributes<Attributes: Encodable, Relationships: Encodable>: Encodable {
    var attributes: Attributes
    var relationships: Relationships
    var type: String
}

struct ASCPostDataResponse: Encodable {
    var data: ASCIdentifiedType
}
