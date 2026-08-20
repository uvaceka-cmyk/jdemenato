import { env } from "cloudflare:workers";
import { getSessionUser } from "../../../auth";
export async function POST(request: Request) {
  const user=await getSessionUser(); if(!user)return Response.json({error:"Nejprve se přihlaste."},{status:401});
  const body=await request.json() as Record<string,unknown>; const desiredRole=clean(body.desiredRole),location=clean(body.location),workTypes=clean(body.workTypes),education=clean(body.education,3000),experience=clean(body.experience,5000),skills=clean(body.skills,1500);
  if(!desiredRole||!location||!workTypes||!education||!experience||!skills)return Response.json({error:"Vyplňte prosím všechna povinná pole."},{status:400});
  const now=Date.now(),visibility=body.visibility==="employers"?"employers":"private";
  await env.DB.prepare(`INSERT INTO candidate_profiles (id,email,display_name,phone,desired_role,location,work_types,salary_expectation,education,experience,skills,preferences,requirements,summary,visibility,updated_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,display_name=excluded.display_name,phone=excluded.phone,desired_role=excluded.desired_role,location=excluded.location,work_types=excluded.work_types,salary_expectation=excluded.salary_expectation,education=excluded.education,experience=excluded.experience,skills=excluded.skills,preferences=excluded.preferences,requirements=excluded.requirements,summary=excluded.summary,visibility=excluded.visibility,updated_at=excluded.updated_at`)
    .bind(user.userId,user.email,user.displayName,clean(body.phone),desiredRole,location,workTypes,clean(body.salaryExpectation),education,experience,skills,clean(body.preferences,2000),clean(body.requirements,2000),clean(body.summary,2000),visibility,now,now).run();
  return Response.json({ok:true});
}
function clean(value:unknown,limit=500){return typeof value==="string"?value.trim().slice(0,limit):""}
