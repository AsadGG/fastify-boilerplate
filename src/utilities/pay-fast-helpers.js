export function getPayfastHTML(data) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto-Submit PayFast Form</title>
  </head>
  <body style="display: none">
    <form
      id="form"
      action="https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
      method="POST"
    >
      <div>
        <input name="MERCHANT_ID" value="${data.merchantId}" />
        <input name="MERCHANT_NAME" value="${data.merchantName}" />
        <input name="PROCCODE" value="00" />
        <input name="TOKEN" value="${data.accessToken}" />
        <input name="TXNAMT" value="${data.totalPrice}" />
        <input name="CUSTOMER_MOBILE_NO" value="${data.clientPhone}" />
        <input name="CUSTOMER_EMAIL_ADDRESS" value="${data.clientEmail}" />
        <input
          name="SIGNATURE"
          value="THIS REQUEST IS SENT BY FIT AND FIGHT WEB APP"
        />
        <input name="VERSION" value="0.0.1" />
        <input name="SUCCESS_URL" value="${data.successURL}" />
        <input name="FAILURE_URL" value="${data.failureURL}" />
        <input name="BASKET_ID" value="${data.orderId}" />
        <input name="ORDER_DATE" value="${data.generatedDateTime}" />
        <input name="CHECKOUT_URL" value="${data.webHookURL}" />
        <input name="MERCHANT_CUSTOMER_ID" value="${data.clientId}" />
        <input name="CURRENCY_CODE" value="PKR" />
        <input name="CUSTOMER_NAME" value="${data.clientName}}" />
      </div>

      <button type="submit">Submit</button>
    </form>

    <script>
      const form = document.getElementById("form");

      function submitForm() {
        form.submit();
      }

      window.onload = submitForm;
    </script>
  </body>
</html>
`;
}
