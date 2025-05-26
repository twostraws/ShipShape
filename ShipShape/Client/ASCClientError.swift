//
// ASCClientError.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

enum ASCClientError: Error {
    case invalidEndpoint
    case connectionError
    case decodingFailed
}
