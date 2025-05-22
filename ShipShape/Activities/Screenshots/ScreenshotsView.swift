//
// ScreenshotsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ScreenshotsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @State private var availableLocales: [String] = []
    @State private var selectedLocale: String = ""
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                Picker("Locale", selection: $selectedLocale) {
                    ForEach(availableLocales, id: \.self) { locale in
                        Text(Locale.current.localizedString(forIdentifier: locale) ?? locale).tag(locale)
                    }
                }
                .pickerStyle(.menu)

                if let localization = app.localizations.first(where: { locale in
                    locale.attributes.locale == selectedLocale
                }) {
                    ForEach(localization.screenshotSets, content: ScreenshotSetView.init)
                } else {
                    Text("No screenshots.")
                }
            }
            .formStyle(.grouped)
        }
        .task(load)
        .onChange(of: selectedLocale) {
            Task {
                await loadScreenshotSets()
            }
        }
        .toolbar {
            ReloadButton(action: load)
        }
    }

    func load() async {
        Task {
            do {
                loadState = .loading

                try await client.getVersions(of: app)

                let locales = Set(app.localizations.compactMap { $0.attributes.locale })
                availableLocales = Array(locales).sorted()

                DispatchQueue.main.async {
                    if selectedLocale.isEmpty {
                        selectedLocale = app.attributes.primaryLocale
                    }
                }

                await loadScreenshotSets()

                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }

    func loadScreenshotSets() async {
        guard
            let localization = app.localizations.first(where: { locale in
                locale.attributes.locale == selectedLocale
            })
        else { return }

        do {
            try await client.getScreenshotSets(of: localization, for: app)
        } catch {
            logger.error("\(error.localizedDescription)")
            loadState = .failed
        }
    }
}
