export const fireNotification = (code, params) => {
  const url = `/notification/push/send`;
  const payload = {
    templateId: code,
    parameters: params,
  };

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        console.log(`[Notify-Client] Success sending notification ${code}`);
      } else {
        console.error(
          `[Notify-Client] Error sending notification ${code}, reason: ${json.reason}`
        );
      }
    })
    .catch((err) => {
      console.error(
        `[Notify-Client] System rrror sending notification ${code}, reason: ${err}`
      );
    });
};
