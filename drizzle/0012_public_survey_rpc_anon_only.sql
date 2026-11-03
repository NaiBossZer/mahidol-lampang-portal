-- The public survey endpoint uses the anonymous project key; signed-in clients do not need direct RPC access.
revoke execute on function public.get_public_survey_occurrence(uuid) from authenticated;
grant execute on function public.get_public_survey_occurrence(uuid) to anon;
