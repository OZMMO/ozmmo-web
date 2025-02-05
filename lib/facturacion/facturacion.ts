"use server";
//import { Comprobante } from "@nodecfdi/cfdi-elements";
import {
  Comprobante,
  Concepto,
  Emisor,
  Receptor,
  InformacionGlobal,
} from "@nodecfdi/cfdi-elements/cfdi40";
import { XmlNode, nodeToXmlString } from "@nodecfdi/cfdi-core";
import { SumasConceptos, SumasConceptosWriter } from "@nodecfdi/cfdi-elements";
import { Cleaner } from "@nodecfdi/cfdi-cleaner";
import { writeFileSync } from "fs";
import { EmpresaModel, Empresa, CriteriaSqlServer } from "@/lib/db";
import { ClienteModel, Cliente } from "@/lib/db";
import {
  Certificate,
  Credential,
  PrivateKey,
} from "@nodecfdi/credentials/node";
import { string } from "zod";
import { CFDIGenerator, CFDIGeneratorProps } from "./CFDIGenerator";
import SWSDK from "./sw-sdk/SWSDK";
import moment from "moment";
import { FileCreator } from "../fileCreator";

export async function simularFactura() {
  const empresaModel = new EmpresaModel();
  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition("UserId", "");
  criteriaEmpresa.addConditition("id", "4");
  const { data: dataEmpresas } = await empresaModel.findMany(criteriaEmpresa);
  const empresa = dataEmpresas[0];
  //console.log(empresa);

  const clienteModel = new ClienteModel();
  const criteriaCliente = new CriteriaSqlServer<Cliente>();
  criteriaCliente.addConditition("UserId", "");
  criteriaCliente.addConditition("id", "11");
  const { data: dataClientes } = await clienteModel.findMany(criteriaCliente);
  const cliente = dataClientes[0];

  const cfdiParams: CFDIGeneratorProps = {
    Exportacion: "01",
    Fecha: moment().format("YYYY-MM-DDTHH:mm:ss"),
    Folio: "1234567890",
    FormaPago: "99",
    LugarExpedicion: "42501",
    MetodoPago: "PUE",
    Moneda: "MXN",
    Serie: "XA",
    SubTotal: "100",
    Total: "100",
    TipoDeComprobante: "I",
    Version: "4.0",
    Sello: "",
    Certificado: "",
    NoCertificado: "",
  };

  const cfdiGenerator = new CFDIGenerator(cfdiParams);

  cfdiGenerator.setEmisor(empresa.rfc, empresa.razon_social, "601");
  cfdiGenerator.setReceptor(
    cliente.rfc,
    cliente.razon_social,
    "S01",
    "605",
    "36257"
  );
  cfdiGenerator.addConcepto(
    "01010101",
    "XEXX",
    1,
    "ACT",
    100,
    100,
    "01",
    100,
    "002",
    "Tasa",
    "0.160000",
    0.16
  );
  /*cfdiGenerator.setCertificado(
    "C:/AdagioGit/erp-web-app/lib/facturacion/EKU9003173C9/EKU9003173C9.cer",
    "C:/AdagioGit/erp-web-app/lib/facturacion/EKU9003173C9/EKU9003173C9.key",
    "12345678a"
  );*/

  const xmlString = cfdiGenerator.getXmlString();
  //console.log(cliente);

  /*CERTIFICADO Y AGREGADO DE CERTIFICADO */

  console.log(xmlString);

  var params = {
    url: "http://services.test.sw.com.mx",
    token:
      "T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbXB3YVZxTHdOdHAwVXY2NTdJb1hkREtXTzE3dk9pMmdMdkFDR2xFWFVPUXpTUm9mTG1ySXdZbFNja3FRa0RlYURqbzdzdlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRZWWR5TzRIbTVpVDYzZlFlUW9SUFJDMThvRkdxV0lWbytrcS83aUd2U09PdHR5ZzJGNTFScUxobWkxWUpmdER2L0w3M1doZ0N1NjgyTVE1VjNrQUdadmlxYUQ1Tjc0czVSM0dCZVJGN2hUU2hiYVAydmFHN2pOc2VlV0YySXJ4bXNhbGlZYTZYeFJNY0lBNTVyZTFNazJPQm9Sc2l3WGVaUUhabXpWNUVNTW03b1V1ZkgvbXVBd0x6R0cxVWp5bXBKOFMrQjVOZ1F3L2szMUMyM0M2Y3BxVHBpUFllMkpXdEVHa0h2L0IwZmJLMlRmUi9VemFRRzNsbDNHMFh6VjlQSGFmRllNUUNhWjNnL05LT0c5c25FZENSVDg3dmxPb3g0aFNUcktwSnRUSHRxTndQTiszazV4ZDJ3M2Q2M3RzUHlwd3k1Y2JjWGllUGtLcjRGRmFZR29EY09CYVhNVkNKODMweE04OHU1UmZZRDVzcTRDUUc0Um5JQzA5cG9UNWtBdDhrYWtqTjJUUFBoYjFPTndFUkZRPT0.PoK0p0b1KBwjuMccJ5IT_8FCBr0nrJETOhmQJ8UquUw",
  };

  let stamp = SWSDK.IssueService.Set(params);
  stamp.IssueV4(xmlString, (err: any, contents: any) => {
    console.log(contents);
    console.log(err);

    if (contents.status === "success") {
      const filePathxml = FileCreator.createFile({
        basePath: "./CFDI",
        fileName: contents.data.uuid,
        extension: "xml",
        content: contents.data.cfdi,
        overwrite: true,
      }).then((filePath) => {
        console.log(`Archivo creado en: ${filePath}`);
      });
      const filePathCadenaOriginal = FileCreator.createFile({
        basePath: "./CFDI",
        fileName: contents.data.uuid + "_cadenaOriginalSAT",
        extension: "txt",
        content: contents.data.cadenaOriginalSAT,
        overwrite: true,
      }).then((filePath) => {
        console.log(`Archivo creado en: ${filePath}`);
      });

      const rutaQR = FileCreator.createImageFromBase64({
        basePath: "./CFDI",
        fileName: contents.data.uuid + "_qr",
        base64String: contents.data.qrCode,
        extension: "jpeg",
        overwrite: true,
      }).then((filePath) => {
        console.log(`Archivo creado en: ${filePath}`);
      });
    }
  });
  // console.log(fiel.isCsd());

  /*console.log(fiel.isCsd());
  if (fiel.isCsd()) {
    const signature = fiel.sign(xmlString);
    //console.info(signature);

    const verify = fiel.verify(xmlString, signature);
    //console.info(verify);

    writeFileSync("factura.xml", xmlDocument.toString());
  }*/
  //console.log(xmlDocument);
  //return xmlString;
}
