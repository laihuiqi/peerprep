const pythonTemplate = "class Solution:\n" +
    "    def solve(self, x : int, y : int) -> int:\n" +
    "        return 0\n";

const cTemplate = "bool solve(int x, int y){\n" +
    "    return 0;\n" +
    "}"

const cppTemplate = "class Solution {\n" +
    "public:\n" +
    "    int solve(int x, int y) {\n" +
    "        return 0;\n" +
    "    }\n" +
    "};"

const csharpTemplate = "public class Solution {\n" +
    "    public int solve(int x, int y) {\n" +
    "        return 0;\n" +
    "    }\n" +
    "}"

const jsTemplate = "/**\n" +
    " * @param {int} x\n" +
    " * @param {int} y\n" +
    " * @return {int}\n" +
    " */\n" +
    "var exist = function(x, y) {\n" +
    "    return 0;\n" +
    "};"

const goTemplate = "func solve(x int, y int) int {\n" +
    "    return 0\n" +
    "}"

const javaTemplate = "class Solution {\n" +
    "    public int exist(int x, int y) {\n" +
    "        return 0;\n" +
    "    }\n" +
    "}"

const kotlinTemplate = "class Solution {\n" +
    "    fun solve(x: Int,  y: Int): Int {\n" +
    "        return x;\n" +
    "    }\n" +
    "}"

export const templates =
    {"c": cTemplate, "cpp": cppTemplate, "csharp": csharpTemplate, "javascript": jsTemplate,
        "java": javaTemplate, "go": goTemplate, "kotlin": kotlinTemplate, "python": pythonTemplate}