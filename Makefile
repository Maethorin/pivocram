#!/bin/sh

test:
	@echo "Testing..."
	coverage2 run --branch `which nosetests` tests
	coverage2 report -m --fail-under=70