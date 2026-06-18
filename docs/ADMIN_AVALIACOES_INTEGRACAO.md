# Integração das avaliações no Admin

Para aprovar:

```ts
await supabase.from('avaliacoes').update({ aprovado: true, status: 'aprovado' }).eq('id', id);
```

Para reprovar:

```ts
await supabase.from('avaliacoes').update({ aprovado: false, status: 'reprovado' }).eq('id', id);
```

Para excluir:

```ts
await supabase.from('avaliacoes').delete().eq('id', id);
```
