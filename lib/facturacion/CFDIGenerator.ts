import fs from "fs";
import {
  Comprobante,
  Emisor,
  Receptor,
  Concepto,
  Impuestos,
} from "@nodecfdi/cfdi-elements/cfdi40";
import { SumasConceptos, SumasConceptosWriter } from "@nodecfdi/cfdi-elements";
import { XmlNode, nodeToXmlString } from "@nodecfdi/cfdi-core";

import * as SaxonJS from "saxonjs-he";
// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution

import {
  Certificate,
  Credential,
  PrivateKey,
} from "@nodecfdi/credentials/node";
import { readFileSync } from "fs";
import { TransformResult } from "saxonjs-he";

export interface CFDIGeneratorProps {
  Exportacion: string;
  Fecha: string;
  Folio: string;
  FormaPago: string;
  LugarExpedicion: string;
  MetodoPago: string;
  Moneda: string;
  Serie: string;
  SubTotal: string;
  Total: string;
  TipoDeComprobante: string;
  Version: string;
  Sello: string;
  Certificado: string;
  NoCertificado: string;
}

export function base64ToBuffer(base64: string): Buffer {
  const binaryString = atob(base64); // Decodificar Base64
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return Buffer.from(bytes.buffer);
}

export class CFDIGenerator {
  private _comprobante: Comprobante;
  constructor({
    Exportacion,
    Fecha,
    Folio,
    FormaPago,
    LugarExpedicion,
    MetodoPago,
    Moneda,
    Serie,
    SubTotal,
    Total,
    TipoDeComprobante,
    Version,
    Sello,
    Certificado,
    NoCertificado,
  }: CFDIGeneratorProps) {
    this._comprobante = new Comprobante({
      Exportacion: Exportacion,
      Fecha: Fecha,
      Folio: Folio,
      FormaPago: FormaPago,
      LugarExpedicion: LugarExpedicion,
      MetodoPago: MetodoPago,
      Moneda: Moneda,
      Serie: Serie,
      SubTotal: SubTotal,
      Total: Total,
      TipoDeComprobante: TipoDeComprobante,
      Version: Version,
      Sello: Sello,
      Certificado: Certificado,
      NoCertificado: NoCertificado,
    });
  }
  setEmisor(rfc: string, nombre: string, regimenFiscal: string) {
    this._comprobante.addEmisor({
      Rfc: rfc,
      Nombre: nombre,
      RegimenFiscal: regimenFiscal,
    });
  }

  setReceptor(
    rfc: string,
    nombre: string,
    usoCFDI: string,
    regimenFiscalReceptor: string,
    DomicilioFiscalReceptor: string
  ) {
    this._comprobante.addReceptor({
      Rfc: rfc,
      Nombre: nombre,
      UsoCFDI: usoCFDI,
      RegimenFiscalReceptor: regimenFiscalReceptor,
      DomicilioFiscalReceptor: DomicilioFiscalReceptor,
    });
  }

  addConcepto(
    ClaveProdServ: string,
    Descripcion: string,
    Cantidad: number,
    ClaveUnidad: string,
    ValorUnitario: number,
    Importe?: number,
    ObjetoImp?: string,
    Base?: number,
    Impuesto?: string,
    TipoFactor?: string,
    TasaOCuota?: string,
    ImporteImpuesto?: number
  ) {
    this._comprobante.addConcepto({
      ClaveProdServ: ClaveProdServ,
      Descripcion: Descripcion,
      Cantidad: Cantidad.toString(),
      ClaveUnidad: ClaveUnidad,
      ValorUnitario: ValorUnitario.toString(),
      Importe: Importe
        ? Importe.toFixed(2)
        : (Cantidad * ValorUnitario).toFixed(2),
      ObjetoImp: ObjetoImp,
    });
    /* .addTraslado({
        Base: Base ? Base.toFixed(2) : (Cantidad * ValorUnitario).toFixed(2),
        Impuesto: Impuesto ? Impuesto : "002",
        TipoFactor: TipoFactor ? TipoFactor : "Tasa",
        TasaOCuota: TasaOCuota ? TasaOCuota : "0.160000",
        Importe: ImporteImpuesto
          ? ImporteImpuesto.toFixed(2)
          : (Cantidad * ValorUnitario * 0.16).toFixed(2),
      });*/
  }
  setCertificado(
    certificadoPath?: string,
    privateKeyPath?: string,
    password?: string
  ) {
    //console.log(certificadoPath, privateKeyPath, password);

    const credencial = Credential.openFiles(
      certificadoPath || "",
      privateKeyPath || "",
      password || ""
    );
    //console.log(credencial.certificate().pemAsOneLine());

    this._comprobante.searchAttribute(
      "Certificado",
      credencial.certificate().pemAsOneLine()
    );
    this._comprobante.searchAttribute(
      "NoCertificado",
      credencial.certificate().serialNumber().toString()
    );
    // Ruta al archivo XSLT para la cadena original
    const xsltPath =
      "C:/AdagioGit/erp-web-app/lib/facturacion/XSLT/cadenaoriginal_4_0.xslt";
    const xsltContent = readFileSync(xsltPath, "utf8");
    console.log(xsltContent);
    // Parsear XML y XSLT
    const xmlString = this.getXmlString();
    const processor = SaxonJS.transform(
      {
        stylesheet: {
          documentText: xsltContent,
        },
        source: {
          documentText: xmlString,
        },
        destination: "text",
      },
      "sync"
    ) as TransformResult;

    // Obtener el resultado
    const cadenaOriginal = processor.principalResult;
    console.log(cadenaOriginal);
    const sello = credencial.sign(cadenaOriginal);
    console.log(sello);
    this.setSello(sello);
  }

  setSello(sello: string) {
    this._comprobante.searchAttribute("Sello", sello);
  }

  public getComprobante(): Comprobante {
    return this._comprobante;
  }
  public getXmlString(): string {
    return nodeToXmlString(this._comprobante, true);
  }
}
