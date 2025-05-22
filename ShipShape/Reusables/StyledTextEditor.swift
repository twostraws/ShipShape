//
// StyledTextEditor.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct StyledTextEditor: View {
    @Binding var text: String

    var body: some View {
        ZStack {
            TextEditor(text: $text)
                .frame(height: 200)
                .scrollContentBackground(.hidden)
                .padding(5)
        }
        .background(Color.gray.opacity(0.1))
        .clipShape(.rect(cornerRadius: 5))
    }
}

#Preview {
    StyledTextEditor(text: .constant("This is a test."))
}
