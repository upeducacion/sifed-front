import { procedureGroups, proceduresInGroup } from "@/lib/tramites/catalog";

export default function ProcedureOptions() {
  return procedureGroups.map((group) => (
    <optgroup key={group.id} label={group.title}>
      {proceduresInGroup(group.id).map((procedure) => (
        <option key={procedure.slug} value={procedure.slug}>
          {procedure.step ? `Paso ${procedure.step.label} · ${procedure.title}` : procedure.title}
        </option>
      ))}
    </optgroup>
  ));
}
