install-dev:
    @echo "Creating virtual environment..."
    uv sync --all-extras --dev

install:
    @echo "Creating virtual environment..."
    uv sync

test: install-dev
    @echo "Running tests..."
    uv run coverage run -m unittest discover -v -s ./test -p "*_test.py"

package-mac: install-dev
    @echo "Packaging for macOS..."
    rm -rf build dist public
    npm run frontend:prod
    uv run nuitka \
    --standalone \
    --output-dir=dist \
    --include-data-dir=public=public \
    --macos-create-app-bundle \
    --enable-console \
    main.py