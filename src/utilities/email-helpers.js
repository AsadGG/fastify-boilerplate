import puppeteer from 'puppeteer';

function getMealName(mealType) {
  if (mealType === 'BREAKFAST') {
    return 'Breakfast';
  }
  if (mealType === 'SNACK_ONE') {
    return 'Snack';
  }
  if (mealType === 'LUNCH') {
    return 'Lunch';
  }
  if (mealType === 'SNACK_TWO') {
    return 'Snack';
  }
  if (mealType === 'DINNER') {
    return 'Dinner';
  }
  return '';
}

function getMealPriority(mealType) {
  if (mealType === 'BREAKFAST') {
    return 1;
  }
  if (mealType === 'SNACK_ONE') {
    return 2;
  }
  if (mealType === 'LUNCH') {
    return 3;
  }
  if (mealType === 'SNACK_TWO') {
    return 4;
  }
  if (mealType === 'DINNER') {
    return 5;
  }
  return 0;
}

export function generateDietPlanHTML(dietPlan) {
  const dietPlanItemGroups = dietPlan.dietPlanItems
    .sort(function (a, b) {
      return a.day - b.day;
    })
    .sort(function (a, b) {
      return getMealPriority(a.mealType) - getMealPriority(b.mealType);
    })
    .reduce((previousValue, currentValue) => {
      if (!previousValue[currentValue.day]) {
        previousValue[currentValue.day] = [];
      }
      previousValue[currentValue.day].push(currentValue);
      return previousValue;
    }, {});

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en"><head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
    <meta name="x-apple-disable-message-reformatting">
  </head>
  <body>
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody>
    <tr>
      <td>
        <p
          style="
            font-size: 2.25rem;
            line-height: 1.5;
            margin: 16px 0;
            font-weight: 700;
            color: rgb(186, 31, 37);
            text-align: center;
          "
        >
          ${dietPlan.name}
        </p>
      </td>
    </tr>
  </tbody>
</table>

 ${Object.entries(dietPlanItemGroups)
   .map(
     ([key, value]) =>
       `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody>
    <tr>
      <td>
        <p
          style="
            font-size: 0.875rem;
            line-height: 1.25rem;
            margin: 16px 0;
            font-weight: 700;
            color: rgb(3, 7, 18);
          "
        >
          Day
          <!-- -->${key}
        </p>
        
           ${value
             .map((dietPlanItem) => {
               return `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody style="width: 100%">
            <tr style="width: 100%">
              <td
                data-id="__react-email-column"
                style="
                  font-weight: 700;
                  color: rgb(3, 7, 18);
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  width: 5rem;
                "
              >
                ${getMealName(dietPlanItem.mealType)}
              </td>
              <td
                data-id="__react-email-column"
                style="
                  width: 24rem;
                  font-weight: 600;
                  color: rgb(107, 114, 128);
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                "
              >
                ${dietPlanItem.meal}
              </td>
              <td
                data-id="__react-email-column"
                style="
                  font-weight: 600;
                  color: rgb(107, 114, 128);
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                "
              >
              ${dietPlanItem.startTime}<!-- -->
                -
                <!-- -->${dietPlanItem.endTime}
              </td>
            </tr>
          </tbody>
        </table>`;
             })
             .join('')}
      </td>
    </tr>
  </tbody>
</table>`
   )
   .join('')}


<table
  align="center"
  width="100%"
  border="0"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
>
  <tbody>
    <tr>
      <td>
        <p
          style="
            font-size: 1.5rem;
            line-height: 1.5;
            margin: 16px 0;
            font-weight: 600;
            color: rgb(3, 7, 18);
          "
        >
          Note
        </p>
        <p
          style="
            font-size: 1rem;
            line-height: 1.5;
            margin: 16px 0;
            font-weight: 500;
            color: rgb(107, 114, 128);
          "
        >
          ${dietPlan.note}
        </p>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
    `;
}

export async function convertHTMLToPDFBase64(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({});

    const base64String = Buffer.from(pdfBuffer).toString('base64');

    await browser.close();

    return base64String;
  } catch (error) {
    await browser.close();
    throw error;
  }
}
