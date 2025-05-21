###############################################################################
# Building from make rather than the previous shell script gives us a lot of
# flexibility and is a bit simpler to integrate with Xcode.
#
# Usage:
# make build|clean TARGET=target
# Specifying a target is required.
#
# Make will assume that this makefile is in the root of your project, at the
# same level as your source Contents/ directory. To use this file from Xcode,
# create an External Build System target, and specify `/usr/bin/make` as the
# build tool, `$(ACTION) TARGET=your_target_or_variable` as the arguments,
# and for Directory, a path to this file, e.g., `$(PROJECT_DIR)/path/to/me`.
###############################################################################


#====================================================================
# Prerequisites:
# - Ensure that a TARGET is specified.
# - Make sure Middlemac is installed and reachable. Although we
#   could do that in a recipe, we need to discover our BUILD_DIR, 
#   which cannot be done in a recipe.
# - Discover our BUILD_DIR, by asking Middleman for the build 
#   directory for the specified target.
# Output will be provided in a target recipe if these conditions
# cannot be met.
#====================================================================

ifdef TARGET
	MM_EXISTS := $(shell [[ -s "$(HOME)/.rvm/environments/default" ]] && source "$(HOME)/.rvm/environments/default" ; which middlemac)
endif
ifdef MM_EXISTS
	BUILD_DIR := $(shell export LANG=en_US.UTF-8 && [[ -s "$(HOME)/.rvm/environments/default" ]] && source "$(HOME)/.rvm/environments/default" ; bundle exec middleman list_all | grep "$(TARGET)," | cut -d\  -f2- )
endif


#====================================================================
# "Source" files to monitor for changes. If any of these change,
# then they will have a new file modification date than the
# $(BUILD_DIR), causing the action to execute.
#====================================================================
SRC_FILES = $(shell find Contents)
SRC_FILES += config.rb Gemfile Gemfile.lock

#====================================================================
# The default action, will build the specified TARGET using
# Middleman, by depending on the $(BUILD_DIR).
#====================================================================
.PHONY: build
build: check_prerequisites $(BUILD_DIR)


#====================================================================
# The action that will actually perform the building of the help
# book. If the directory specified by $(BUILD_DIR) is older than
# any of the given source files, then this action will be executed.
# NOTE: make does NOT work with spaces in filenames.
#====================================================================
$(BUILD_DIR): $(SRC_FILES)
	@echo "Make will have Middleman build target '$(TARGET)'"
# 	@echo "RECIPE AS KNOWN TO MAKE: $@"
# 	@echo "       ACTUAL BUILD_DIR: $(BUILD_DIR)"
# 	@echo "       EXECUTION REASON: $?"
	@export LANG=en_US.UTF-8 && \
	[[ -s "$(HOME)/.rvm/environments/default" ]] && source "$(HOME)/.rvm/environments/default" ; \
	bundle exec middleman build --target "$(TARGET)"
	@touch "$(BUILD_DIR)"


#====================================================================
# Clean the given target.
#====================================================================
.PHONY: clean
clean: check_prerequisites
	@echo "Cleaning $(BUILD_DIR)…"
	@rm -rf "$(BUILD_DIR)"


#====================================================================
# Ensure that we have everything that we need to proceed with doing
# something with Middlemac and with the target.
#====================================================================
.PHONY: check_prerequisites
check_prerequisites:
ifndef TARGET
	$(error "ERROR: It's required to specify a target macro, e.g., TARGET=default.")
endif
ifndef MM_EXISTS
	$(error "ERROR: Middlemac was not found, and is required to continue.")
endif
ifndef BUILD_DIR
	$(error "ERROR: Target ${TARGET} was specified, but Middlemac did not find any valid targets.")
endif
