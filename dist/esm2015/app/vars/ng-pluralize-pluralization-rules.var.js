/**
 * Pluralization rules.
 */
export var NgPluralizePluralizationRules = [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctcGx1cmFsaXplLXBsdXJhbGl6YXRpb24tcnVsZXMudmFyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9qcnF1aWNrL2RldmVsb3BtZW50L2VuY291bnRpbmcvbmctcGx1cmFsaXplL3NyYy8iLCJzb3VyY2VzIjpbImFwcC92YXJzL25nLXBsdXJhbGl6ZS1wbHVyYWxpemF0aW9uLXJ1bGVzLnZhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sQ0FBQyxJQUFJLDZCQUE2QixHQUFHO0lBQ3pDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztJQUNiLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDO0lBQzVCLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDO0lBQ3pCLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztJQUN6QixDQUFDLG9DQUFvQyxFQUFFLE1BQU0sQ0FBQztJQUM5QyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUM7SUFDdkIsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLENBQUM7SUFDaEQsQ0FBQywyRkFBMkYsRUFBRSxLQUFLLENBQUM7SUFDcEcsQ0FBQywrQkFBK0IsRUFBRSxNQUFNLENBQUM7SUFDekMsQ0FBQywwQkFBMEIsRUFBRSxNQUFNLENBQUM7SUFDcEMsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUM7SUFDM0IsQ0FBQyx1SEFBdUgsRUFBRSxLQUFLLENBQUM7SUFDaEksQ0FBQyxvR0FBb0csRUFBRSxLQUFLLENBQUM7SUFDN0csQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO0lBQ2hCLENBQUMsMENBQTBDLEVBQUUsU0FBUyxDQUFDO0lBQ3ZELENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO0lBQzlCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO0lBQ2pDLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDO0lBQzdCLENBQUMsK0NBQStDLEVBQUUsUUFBUSxDQUFDO0lBQzNELENBQUMsK0JBQStCLEVBQUUsT0FBTyxDQUFDO0lBQzFDLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDO0lBQ2pDLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO0lBQzlCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztJQUNoQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7SUFDbkIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0NBQ2hCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBsdXJhbGl6YXRpb24gcnVsZXMuXG4gKi9cbmV4cG9ydCB2YXIgTmdQbHVyYWxpemVQbHVyYWxpemF0aW9uUnVsZXMgPSBbXG4gIFsvcz8kL2ksICdzJ10sXG4gIFsvW15cXHUwMDAwLVxcdTAwN0ZdJC9pLCAnJDAnXSxcbiAgWy8oW15hZWlvdV1lc2UpJC9pLCAnJDEnXSxcbiAgWy8oYXh8dGVzdClpcyQvaSwgJyQxZXMnXSxcbiAgWy8oYWxpYXN8W15hb3VddXN8dFtsbV1hc3xnYXN8cmlzKSQvaSwgJyQxZXMnXSxcbiAgWy8oZVttbl11KXM/JC9pLCAnJDFzJ10sXG4gIFsvKFtebF1pYXN8W2FlaW91XWxhc3xbZWp6cl1hc3xbaXVdYW0pJC9pLCAnJDEnXSxcbiAgWy8oYWx1bW58c3lsbGFifHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMWknXSxcbiAgWy8oYWx1bW58YWxnfHZlcnRlYnIpKD86YXxhZSkkL2ksICckMWFlJ10sXG4gIFsvKHNlcmFwaHxjaGVydWIpKD86aW0pPyQvaSwgJyQxaW0nXSxcbiAgWy8oaGVyfGF0fGdyKW8kL2ksICckMW9lcyddLFxuICBbLyhhZ2VuZHxhZGRlbmR8bWlsbGVubml8ZGF0fGV4dHJlbXxiYWN0ZXJpfGRlc2lkZXJhdHxzdHJhdHxjYW5kZWxhYnJ8ZXJyYXR8b3Z8c3ltcG9zaXxjdXJyaWN1bHxhdXRvbWF0fHF1b3IpKD86YXx1bSkkL2ksICckMWEnXSxcbiAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxoZWRyfGF1dG9tYXQpKD86YXxvbikkL2ksICckMWEnXSxcbiAgWy9zaXMkL2ksICdzZXMnXSxcbiAgWy8oPzooa25pfHdpfGxpKWZlfChhcnxsfGVhfGVvfG9hfGhvbylmKSQvaSwgJyQxJDJ2ZXMnXSxcbiAgWy8oW15hZWlvdXldfHF1KXkkL2ksICckMWllcyddLFxuICBbLyhbXmNoXVtpZW9dW2xuXSlleSQvaSwgJyQxaWVzJ10sXG4gIFsvKHh8Y2h8c3N8c2h8enopJC9pLCAnJDFlcyddLFxuICBbLyhtYXRyfGNvZHxtdXJ8c2lsfHZlcnR8aW5kfGFwcGVuZCkoPzppeHxleCkkL2ksICckMWljZXMnXSxcbiAgWy9cXGIoKD86dGl0KT9tfGwpKD86aWNlfG91c2UpJC9pLCAnJDFpY2UnXSxcbiAgWy8ocGUpKD86cnNvbnxvcGxlKSQvaSwgJyQxb3BsZSddLFxuICBbLyhjaGlsZCkoPzpyZW4pPyQvaSwgJyQxcmVuJ10sXG4gIFsvZWF1eCQvaSwgJyQwJ10sXG4gIFsvbVthZV1uJC9pLCAnbWVuJ10sXG4gIFsndGhvdScsICd5b3UnXVxuXVxuIl19