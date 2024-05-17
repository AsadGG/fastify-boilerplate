export function multipartConfig() {
  return {
    attachFieldsToBody: 'keyValues',
    async onFile(part) {
      const buffer = await part.toBuffer();
      part.value = {
        type: part.type,
        fieldname: part.fieldname,
        filename: part.filename,
        encoding: part.encoding,
        mimetype: part.mimetype,
        buffer,
        size: buffer.length,
      };
    },
  };
}
