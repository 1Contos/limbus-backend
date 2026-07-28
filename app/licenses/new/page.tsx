import { PageHeader } from "@/components/page-header";
import { NewLicenseForm } from "@/components/new-license-form";

export const metadata = { title: "Nova licença" };

export default function NewLicensePage() {
  return <><PageHeader eyebrow="Licenças / Nova" title="Gerar nova licença" description="Defina os limites iniciais. A chave LIMBUS é criada ao salvar." /><NewLicenseForm /></>;
}
