import { supabaseAdmin } from "@/lib/supabase";
import DashboardCharts from "./DashboardCharts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data } = await supabaseAdmin
    .from("form_responses")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block w-10 h-1.5 rounded-full bg-[#E1343A] mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SETEBAN</h1>
          <p className="text-xs text-gray-500 mt-1">Dashboard · Respostas do Questionário</p>
          <p className="text-sm font-semibold text-[#E1343A] mt-2">{data?.length ?? 0} respostas coletadas</p>
        </div>
        <DashboardCharts data={data ?? []} />
      </div>
    </div>
  );
}
