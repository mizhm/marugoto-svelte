{ pkgs, ... }:
{
  packages = with pkgs;[
    git
  ];

  env.BIOME_BINARY = "@biomejs/cli-linux-x64-musl/biome";

  languages.javascript = {
    enable = true;
    bun.enable = true;
  };
}
