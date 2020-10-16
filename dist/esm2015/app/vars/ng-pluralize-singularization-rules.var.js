/**
 * Singularization rules.
 */
export var NgPluralizeSingularizationRules = [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, '$1ie'],
    [/\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctcGx1cmFsaXplLXNpbmd1bGFyaXphdGlvbi1ydWxlcy52YXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2pycXVpY2svZGV2ZWxvcG1lbnQvZW5jb3VudGluZy9uZy1wbHVyYWxpemUvc3JjLyIsInNvdXJjZXMiOlsiYXBwL3ZhcnMvbmctcGx1cmFsaXplLXNpbmd1bGFyaXphdGlvbi1ydWxlcy52YXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBSSwrQkFBK0IsR0FBRztJQUMzQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFDWCxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFDaEIsQ0FBQywrREFBK0QsRUFBRSxNQUFNLENBQUM7SUFDekUsQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUM7SUFDMUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO0lBQ2QsQ0FBQywrREFBK0QsRUFBRSxNQUFNLENBQUM7SUFDekUsQ0FBQyw2R0FBNkcsRUFBRSxNQUFNLENBQUM7SUFDdkgsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUM7SUFDN0IsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUM7SUFDbEMsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUM7SUFDN0IsQ0FBQywwRkFBMEYsRUFBRSxJQUFJLENBQUM7SUFDbEcsQ0FBQyxvRUFBb0UsRUFBRSxPQUFPLENBQUM7SUFDL0UsQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUM7SUFDeEMsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUM7SUFDN0IsQ0FBQywyRkFBMkYsRUFBRSxNQUFNLENBQUM7SUFDckcsQ0FBQyx3R0FBd0csRUFBRSxNQUFNLENBQUM7SUFDbEgsQ0FBQyw2RkFBNkYsRUFBRSxNQUFNLENBQUM7SUFDdkcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUM7SUFDbEMsQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLENBQUM7SUFDeEMsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUM7SUFDL0IsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUM7SUFDL0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDO0lBQ3RCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQztJQUNuQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7Q0FDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2luZ3VsYXJpemF0aW9uIHJ1bGVzLlxuICovXG5leHBvcnQgdmFyIE5nUGx1cmFsaXplU2luZ3VsYXJpemF0aW9uUnVsZXMgPSBbXG4gIFsvcyQvaSwgJyddLFxuICBbLyhzcykkL2ksICckMSddLFxuICBbLyh3aXxrbml8KD86YWZ0ZXJ8aGFsZnxoaWdofGxvd3xtaWR8bm9ufG5pZ2h0fFteXFx3XXxeKWxpKXZlcyQvaSwgJyQxZmUnXSxcbiAgWy8oYXJ8KD86d298W2FlXSlsfFtlb11bYW9dKXZlcyQvaSwgJyQxZiddLFxuICBbL2llcyQvaSwgJ3knXSxcbiAgWy8oZGd8c3N8b2lzfGxrfG9rfHdufG1ifHRofGNofGVjfG9hbHxpc3xja3xpeHxzc2VyfHRzfHdiKWllcyQvaSwgJyQxaWUnXSxcbiAgWy9cXGIobHwoPzpuZWNrfGNyb3NzfGhvZ3xhdW4pP3R8Y29sbHxmYWVyfGZvb2R8Z2VufGdvb258Z3JvdXB8aGlwcHxqdW5rfHZlZ2d8KD86cG9yayk/cHxjaGFybHxjYWxvcnxjdXQpaWVzJC9pLCAnJDFpZSddLFxuICBbL1xcYihtb258c21pbClpZXMkL2ksICckMWV5J10sXG4gIFsvXFxiKCg/OnRpdCk/bXxsKWljZSQvaSwgJyQxb3VzZSddLFxuICBbLyhzZXJhcGh8Y2hlcnViKWltJC9pLCAnJDEnXSxcbiAgWy8oeHxjaHxzc3xzaHx6enx0dG98Z298Y2hvfGFsaWFzfFteYW91XXVzfHRbbG1dYXN8Z2FzfCg/OmhlcnxhdHxncilvfFthZWlvdV1yaXMpKD86ZXMpPyQvaSwgJyQxJ10sXG4gIFsvKGFuYWx5fGRpYWdub3xwYXJlbnRoZXxwcm9nbm98c3lub3B8dGhlfGVtcGhhfGNyaXxuZSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gIFsvKG1vdmllfHR3ZWx2ZXxhYnVzZXxlW21uXXUpcyQvaSwgJyQxJ10sXG4gIFsvKHRlc3QpKD86aXN8ZXMpJC9pLCAnJDFpcyddLFxuICBbLyhhbHVtbnxzeWxsYWJ8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxdXMnXSxcbiAgWy8oYWdlbmR8YWRkZW5kfG1pbGxlbm5pfGRhdHxleHRyZW18YmFjdGVyaXxkZXNpZGVyYXR8c3RyYXR8Y2FuZGVsYWJyfGVycmF0fG92fHN5bXBvc2l8Y3VycmljdWx8cXVvcilhJC9pLCAnJDF1bSddLFxuICBbLyhhcGhlbGl8aHlwZXJiYXR8cGVyaWhlbGl8YXN5bmRldHxub3VtZW58cGhlbm9tZW58Y3JpdGVyaXxvcmdhbnxwcm9sZWdvbWVufGhlZHJ8YXV0b21hdClhJC9pLCAnJDFvbiddLFxuICBbLyhhbHVtbnxhbGd8dmVydGVicilhZSQvaSwgJyQxYSddLFxuICBbLyhjb2R8bXVyfHNpbHx2ZXJ0fGluZClpY2VzJC9pLCAnJDFleCddLFxuICBbLyhtYXRyfGFwcGVuZClpY2VzJC9pLCAnJDFpeCddLFxuICBbLyhwZSkocnNvbnxvcGxlKSQvaSwgJyQxcnNvbiddLFxuICBbLyhjaGlsZClyZW4kL2ksICckMSddLFxuICBbLyhlYXUpeD8kL2ksICckMSddLFxuICBbL21lbiQvaSwgJ21hbiddXG5dO1xuIl19