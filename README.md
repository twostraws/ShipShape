<h1 align="center">ShipShape</h1>

<p align="center">
    <img src="https://img.shields.io/badge/macOS-14+-blue.svg" />
    <img src="https://img.shields.io/badge/iOS-17+-orange.svg" />
    <img src="https://img.shields.io/badge/Swift-6.1-brightgreen.svg" />
    <a href="https://twitter.com/twostraws">
        <img src="https://img.shields.io/badge/Contact-@twostraws-lightgrey.svg?style=flat" alt="Twitter: @twostraws" />
    </a>
</p>

ShipShape is a free app for accessing Apple's App Store Connect API.

ShipShape was initially created in a [Hacking with Swift+ live stream](https://www.hackingwithswift.com/plus/live-streams/shipshape), but the project is now open sourced so it can be developed further. Our ambition is to produce an app that reads and writes all of the App Store Connect API, making a powerful tool free for everyone.

Once ShipShape is stable, the plan is to merge it into another project called [Control Room](https://github.com/twostraws/ControlRoom), which gives users control over the iOS Simulator.


## Running the app

You'll need Xcode 16 or later to build the code, along with an active App Store Connect account in order to connect to the API.

> [!CAUTION]  
> You need to set the Team and Bundle Identifier values to something of your choosing. To avoid committing these changes to source control, we highly recommend you run `git update-index --assume-unchanged ShipShape.xcodeproj/project.pbxproj` after you clone the repository, which will stop Git from including this change in any commits you make.

When you run ShipShape for the first time, it will guide you through creating a private key to access the App Store Connect API.


## Contribution guide

This is an all-new project, so there are lots of opportunities to get involved:

- Adding new API endpoints, such as reading build data or sales stats.
- Cleaning up the networking code so it's neatly isolated and safer.
- Writing tests for any parts of the code.
- Contribute feature suggestions by filing issues.
- Adding documentation, translations, or code comments.

Everyone is welcome to contribute something, no matter your skill level. This is a great place to learn something new – if you have any doubts about making changes or contributing on GitHub, please join the #ControlRoom channel on the [Hacking with Swift Slack workspace](https://www.hackingwithswift.com/slack).

ShipShape is licensed under the [MIT license](LICENSE) – make sure you read and understand that before contributing.

**Please ensure that SwiftLint returns no errors or warnings before you send in changes.**


## Credits

ShipShape was originally designed and built by Paul Hudson, and is copyright © Paul Hudson 2025.

ShipShape is licensed under the MIT license; for the full license please see the [LICENSE file](LICENSE). 

If you find ShipShape useful, you might find my website full of Swift tutorials equally useful: [Hacking with Swift](https://www.hackingwithswift.com).
