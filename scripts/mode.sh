#!/usr/bin/env bash

is_e2e() {
  [[ "${MODE}" = e2e ]]
}

is_lint() {
  [[ "${MODE}" = lint ]]
}

is_unit() {
  [[ "${MODE}" = test ]]
}

is_universal() {
  [[ "$MODE" = universal ]]
}