using System.Net;

namespace API_Financas.Exceptions
{
    public abstract class FinancasException : SystemException
    {
        public abstract List<string> GetErrorMessages();
        public abstract HttpStatusCode GetStatusCode();
    }
}
