//
// ASCClientTests.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

@testable import ShipShape

import Foundation
import Testing

@MainActor
struct ASCClientTests {
    /// A replacement for URLSession that can send back fixed data.
    struct URLSessionMock: URLSessionProtocol {
        var data: Data

        func data(for request: URLRequest, delegate: (any URLSessionTaskDelegate)?) async throws -> (Data, URLResponse) {
            (data, URLResponse())
        }
    }

    func makeClient(with mock: URLSessionMock) -> ASCClient {
        ASCClient(
            key: "",
            keyID: "",
            issuerID: "",
            session: mock
        )
    }

    @Test func newClientShouldHaveNoApps() async throws {
        let mock = URLSessionMock(data: Data("".utf8))
        let client = makeClient(with: mock)

        #expect(client.apps.isEmpty, "A new ASCClient should have no apps loaded.")
    }
}
