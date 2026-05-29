from __future__ import annotations

import argparse

from pypdf import PdfReader


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf")
    parser.add_argument("--limit", type=int, default=160)
    args = parser.parse_args()

    rows: list[tuple[float, float, str]] = []

    def visitor(text, _cm, tm, _font, _size):
        value = text.strip()
        if value:
            rows.append((round(tm[5], 1), round(tm[4], 1), value))

    reader = PdfReader(args.pdf)
    for page in reader.pages:
        page.extract_text(visitor_text=visitor)

    for y, x, text in sorted(rows, key=lambda row: (-row[0], row[1]))[: args.limit]:
        line = f"{y}\t{x}\t{text}"
        print(line.encode("unicode_escape").decode("ascii"))


if __name__ == "__main__":
    main()
