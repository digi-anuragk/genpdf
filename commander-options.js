export function commaSeparatedList(value) {
  return value.split(',');
}

export function generatePuppeteerPDFMargin(
  value,
) {
  const marginStrings = commaSeparatedList(value);

  const marginTop = marginStrings[0];
  const marginRight = marginStrings[1];
  const marginBottom = marginStrings[2];
  const marginLeft = marginStrings[3];

  const generatedMargins = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };

  return generatedMargins;
}
