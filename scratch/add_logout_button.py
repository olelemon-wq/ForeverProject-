import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Insert handleLogout function before return statement
target_return = "  return ("
handle_logout_code = """  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return ("""

content = content.replace(target_return, handle_logout_code)

# 2. Add logout button to the sidebar user profile block
target_profile_block = """        <div className="mt-8 border-t border-stone-200 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm text-stone-600">👤</div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-500 font-medium">{userPhone}</p>
            </div>
          </div>
        </div>"""

repl_profile_block = """        <div className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-250 flex items-center justify-center text-sm text-stone-650">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-550 font-mono font-medium">{userPhone}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-650 hover:bg-stone-200/50 transition cursor-pointer active:scale-95"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>"""

content = content.replace(target_profile_block, repl_profile_block)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Logout button added successfully!")
