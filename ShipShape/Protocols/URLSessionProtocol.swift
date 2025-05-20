//
// URLSessionProtocol.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// A small protocol that lets us mock URLSession requests easily.
@MainActor
protocol URLSessionProtocol {
    func data(for request: URLRequest, delegate: (any URLSessionTaskDelegate)?) async throws -> (Data, URLResponse)
}

/// URLSession conforms to the protocol automatically.
extension URLSession: URLSessionProtocol { }
